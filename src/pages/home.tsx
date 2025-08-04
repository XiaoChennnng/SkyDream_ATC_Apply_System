import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight, Award, Calendar, FileCheck, Users } from 'lucide-react';

export function HomePage() {
  return (
    <div className="space-y-12 w-full">
      {/* 英雄区域 */}
      <section className="relative rounded-xl overflow-hidden w-full">
        <div className="sky-gradient h-96 flex items-center w-full">
          <div className="w-full px-6">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Skydream<span className="gold-text">管制员申请及管理系统</span>
              </h1>
              <p className="text-lg text-white/90 mb-8">
                专业的管制员培训平台，从申请到考核，一站式管理您的管制员生涯
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="gold" size="lg" asChild>
                  <Link to="/application">立即申请</Link>
                </Button>
                <Button variant="outline" className="bg-white/10 text-white border-white/20" size="lg" asChild>
                  <Link to="/about">了解更多</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 功能介绍 */}
      <section className="w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">系统功能</h2>
          <p className="text-muted-foreground">全面的管制员申请与管理解决方案</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-hover">
            <CardHeader>
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FileCheck className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>管制员申请</CardTitle>
              <CardDescription>
                便捷的在线申请流程，提交您的管制员申请
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                支持多种管制室申请，包括塔台、进近、区域等，并可上传相关证明材料
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/application" className="text-sm text-primary flex items-center">
                申请管制员 <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardFooter>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>考试预约</CardTitle>
              <CardDescription>
                灵活的考试时间安排，理论与实践考核
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                在线预约理论考试和模拟机考试，教员实时确认并提供反馈
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/exams" className="text-sm text-primary flex items-center">
                预约考试 <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardFooter>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>活动考核</CardTitle>
              <CardDescription>
                真实环境下的管制能力评估
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                参与实时管制活动，由专业教员监管并评估您的管制技能
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/activities" className="text-sm text-primary flex items-center">
                预约活动 <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardFooter>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>权限管理</CardTitle>
              <CardDescription>
                完整的权限等级体系
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                从S1到I3的权限等级体系，清晰的晋升路径和权限管理
              </p>
            </CardContent>
            <CardFooter>
              <Link to="/permissions" className="text-sm text-primary flex items-center">
                了解权限 <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* 申请流程 */}
      <section className="bg-muted py-12 px-4 rounded-xl w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">申请流程</h2>
          <p className="text-muted-foreground">成为Skydream管制员的四个简单步骤</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl font-bold">1</div>
            <h3 className="text-xl font-semibold mb-2">提交申请</h3>
            <p className="text-sm text-muted-foreground">
              填写申请表格，提交您的个人信息和管制经验
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl font-bold">2</div>
            <h3 className="text-xl font-semibold mb-2">理论考试</h3>
            <p className="text-sm text-muted-foreground">
              参加理论知识考核，测试您对管制规则的理解
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl font-bold">3</div>
            <h3 className="text-xl font-semibold mb-2">模拟机考试</h3>
            <p className="text-sm text-muted-foreground">
              在模拟环境中展示您的管制技能和应变能力
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl font-bold">4</div>
            <h3 className="text-xl font-semibold mb-2">活动考核</h3>
            <p className="text-sm text-muted-foreground">
              参与实时管制活动，获得正式管制权限
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}